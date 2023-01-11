<?php
/**
 * DISCLAIMER
 *
 * Do not edit or add to this file if you wish to upgrade Gally to newer versions in the future.
 *
 * @package   Gally
 * @author    Gally Team <elasticsuite@smile.fr>
 * @copyright 2022-present Smile
 * @license   Open Software License v. 3.0 (OSL-3.0)
 */

declare(strict_types=1);

namespace Gally\Migrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version_1_0_20230111101721_Initial_Schema extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Initial schema';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE catalog_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE category_configuration_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE category_product_merchandising_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE localized_catalog_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE metadata_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_label_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_option_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE source_field_option_label_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE "user_id_seq" INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE catalog (id INT NOT NULL, code VARCHAR(255) NOT NULL, name VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_1B2C324777153098 ON catalog (code)');
        $this->addSql('CREATE TABLE category (id VARCHAR(255) NOT NULL, parent_id VARCHAR(255) DEFAULT NULL, level INT NOT NULL, path VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE category_configuration (id INT NOT NULL, category_id VARCHAR(255) NOT NULL, catalog_id INT DEFAULT NULL, localized_catalog_id INT DEFAULT NULL, name VARCHAR(255) DEFAULT NULL, is_virtual BOOLEAN DEFAULT NULL, virtual_rule TEXT DEFAULT NULL, use_name_in_product_search BOOLEAN DEFAULT NULL, default_sorting VARCHAR(255) DEFAULT NULL, is_active BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_BB39809C12469DE2 ON category_configuration (category_id)');
        $this->addSql('CREATE INDEX IDX_BB39809CCC3C66FC ON category_configuration (catalog_id)');
        $this->addSql('CREATE INDEX IDX_BB39809C4CF5AFB9 ON category_configuration (localized_catalog_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id ON category_configuration (category_id) WHERE ((catalog_id IS NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_catalog_id ON category_configuration (category_id, catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_catalog_id_localized_catalog_id ON category_configuration (category_id, catalog_id, localized_catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NOT NULL))');
        $this->addSql('CREATE TABLE category_product_merchandising (id INT NOT NULL, category_id VARCHAR(255) NOT NULL, catalog_id INT DEFAULT NULL, localized_catalog_id INT DEFAULT NULL, product_id INT NOT NULL, position INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_CF6203D812469DE2 ON category_product_merchandising (category_id)');
        $this->addSql('CREATE INDEX IDX_CF6203D8CC3C66FC ON category_product_merchandising (catalog_id)');
        $this->addSql('CREATE INDEX IDX_CF6203D84CF5AFB9 ON category_product_merchandising (localized_catalog_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_product_id ON category_product_merchandising (category_id, product_id) WHERE ((catalog_id IS NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_product_id_catalog_id ON category_product_merchandising (category_id, product_id, catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NULL))');
        $this->addSql('CREATE UNIQUE INDEX unique_category_id_product_id_catalog_id_localized_catalog_id ON category_product_merchandising (category_id, product_id, catalog_id, localized_catalog_id) WHERE ((catalog_id IS NOT NULL) AND (localized_catalog_id IS NOT NULL))');
        $this->addSql('CREATE TABLE facet_configuration (id VARCHAR(255) NOT NULL, source_field_id INT NOT NULL, category_id VARCHAR(255) DEFAULT NULL, display_mode VARCHAR(255) DEFAULT NULL, coverage_rate INT DEFAULT NULL, max_size INT DEFAULT NULL, sort_order VARCHAR(255) DEFAULT NULL, is_recommendable BOOLEAN DEFAULT NULL, is_virtual BOOLEAN DEFAULT NULL, position INT DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_108F591B7173162 ON facet_configuration (source_field_id)');
        $this->addSql('CREATE INDEX IDX_108F591B12469DE2 ON facet_configuration (category_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_source_field ON facet_configuration (source_field_id) WHERE (category_id IS NULL)');
        $this->addSql('CREATE UNIQUE INDEX unique_source_field_category ON facet_configuration (source_field_id, category_id) WHERE (category_id IS NOT NULL)');
        $this->addSql('CREATE TABLE localized_catalog (id INT NOT NULL, catalog_id INT NOT NULL, name VARCHAR(255) DEFAULT NULL, code VARCHAR(255) NOT NULL, locale VARCHAR(5) NOT NULL, currency VARCHAR(3) NOT NULL, is_default BOOLEAN DEFAULT \'false\' NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_DB10491E77153098 ON localized_catalog (code)');
        $this->addSql('CREATE INDEX IDX_DB10491ECC3C66FC ON localized_catalog (catalog_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_code_locale ON localized_catalog (code, locale)');
        $this->addSql('CREATE TABLE metadata (id INT NOT NULL, entity VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_4F143414E284468 ON metadata (entity)');
        $this->addSql('CREATE TABLE source_field (id INT NOT NULL, metadata_id INT NOT NULL, code VARCHAR(255) NOT NULL, default_label VARCHAR(255) DEFAULT NULL, type VARCHAR(255) DEFAULT NULL, weight INT DEFAULT 1 NOT NULL, is_searchable BOOLEAN DEFAULT NULL, is_filterable BOOLEAN DEFAULT NULL, is_sortable BOOLEAN DEFAULT NULL, is_spellchecked BOOLEAN DEFAULT NULL, is_used_for_rules BOOLEAN DEFAULT NULL, is_system BOOLEAN DEFAULT \'false\' NOT NULL, search VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_C2FD9E67DC9EE959 ON source_field (metadata_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_metadata_code ON source_field (code, metadata_id)');
        $this->addSql('CREATE TABLE source_field_label (id INT NOT NULL, catalog_id INT NOT NULL, source_field_id INT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_197F96B3CC3C66FC ON source_field_label (catalog_id)');
        $this->addSql('CREATE INDEX IDX_197F96B37173162 ON source_field_label (source_field_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_catalog_source_field ON source_field_label (catalog_id, source_field_id)');
        $this->addSql('CREATE TABLE source_field_option (id INT NOT NULL, source_field_id INT NOT NULL, code VARCHAR(255) NOT NULL, position INT DEFAULT NULL, default_label VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A628500A7173162 ON source_field_option (source_field_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_code_source_field ON source_field_option (source_field_id, code)');
        $this->addSql('CREATE TABLE source_field_option_label (id INT NOT NULL, catalog_id INT NOT NULL, source_field_option_id INT NOT NULL, label VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_A564F6DACC3C66FC ON source_field_option_label (catalog_id)');
        $this->addSql('CREATE INDEX IDX_A564F6DAE4D8B5EE ON source_field_option_label (source_field_option_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_catalog_source_field_option ON source_field_option_label (catalog_id, source_field_option_id)');
        $this->addSql('CREATE TABLE "user" (id INT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_8D93D649E7927C74 ON "user" (email)');
        $this->addSql('ALTER TABLE category_configuration ADD CONSTRAINT FK_BB39809C12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_configuration ADD CONSTRAINT FK_BB39809CCC3C66FC FOREIGN KEY (catalog_id) REFERENCES catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_configuration ADD CONSTRAINT FK_BB39809C4CF5AFB9 FOREIGN KEY (localized_catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_product_merchandising ADD CONSTRAINT FK_CF6203D812469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_product_merchandising ADD CONSTRAINT FK_CF6203D8CC3C66FC FOREIGN KEY (catalog_id) REFERENCES catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE category_product_merchandising ADD CONSTRAINT FK_CF6203D84CF5AFB9 FOREIGN KEY (localized_catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE facet_configuration ADD CONSTRAINT FK_108F591B7173162 FOREIGN KEY (source_field_id) REFERENCES source_field (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE facet_configuration ADD CONSTRAINT FK_108F591B12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE localized_catalog ADD CONSTRAINT FK_DB10491ECC3C66FC FOREIGN KEY (catalog_id) REFERENCES catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field ADD CONSTRAINT FK_C2FD9E67DC9EE959 FOREIGN KEY (metadata_id) REFERENCES metadata (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_label ADD CONSTRAINT FK_197F96B3CC3C66FC FOREIGN KEY (catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_label ADD CONSTRAINT FK_197F96B37173162 FOREIGN KEY (source_field_id) REFERENCES source_field (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_option ADD CONSTRAINT FK_A628500A7173162 FOREIGN KEY (source_field_id) REFERENCES source_field (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_option_label ADD CONSTRAINT FK_A564F6DACC3C66FC FOREIGN KEY (catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE source_field_option_label ADD CONSTRAINT FK_A564F6DAE4D8B5EE FOREIGN KEY (source_field_option_id) REFERENCES source_field_option (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE category_configuration DROP CONSTRAINT FK_BB39809CCC3C66FC');
        $this->addSql('ALTER TABLE category_product_merchandising DROP CONSTRAINT FK_CF6203D8CC3C66FC');
        $this->addSql('ALTER TABLE localized_catalog DROP CONSTRAINT FK_DB10491ECC3C66FC');
        $this->addSql('ALTER TABLE category_configuration DROP CONSTRAINT FK_BB39809C12469DE2');
        $this->addSql('ALTER TABLE category_product_merchandising DROP CONSTRAINT FK_CF6203D812469DE2');
        $this->addSql('ALTER TABLE facet_configuration DROP CONSTRAINT FK_108F591B12469DE2');
        $this->addSql('ALTER TABLE category_configuration DROP CONSTRAINT FK_BB39809C4CF5AFB9');
        $this->addSql('ALTER TABLE category_product_merchandising DROP CONSTRAINT FK_CF6203D84CF5AFB9');
        $this->addSql('ALTER TABLE source_field_label DROP CONSTRAINT FK_197F96B3CC3C66FC');
        $this->addSql('ALTER TABLE source_field_option_label DROP CONSTRAINT FK_A564F6DACC3C66FC');
        $this->addSql('ALTER TABLE source_field DROP CONSTRAINT FK_C2FD9E67DC9EE959');
        $this->addSql('ALTER TABLE facet_configuration DROP CONSTRAINT FK_108F591B7173162');
        $this->addSql('ALTER TABLE source_field_label DROP CONSTRAINT FK_197F96B37173162');
        $this->addSql('ALTER TABLE source_field_option DROP CONSTRAINT FK_A628500A7173162');
        $this->addSql('ALTER TABLE source_field_option_label DROP CONSTRAINT FK_A564F6DAE4D8B5EE');
        $this->addSql('DROP SEQUENCE catalog_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE category_configuration_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE category_product_merchandising_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE localized_catalog_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE metadata_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_label_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_option_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE source_field_option_label_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE "user_id_seq" CASCADE');
        $this->addSql('DROP TABLE catalog');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE category_configuration');
        $this->addSql('DROP TABLE category_product_merchandising');
        $this->addSql('DROP TABLE facet_configuration');
        $this->addSql('DROP TABLE localized_catalog');
        $this->addSql('DROP TABLE metadata');
        $this->addSql('DROP TABLE source_field');
        $this->addSql('DROP TABLE source_field_label');
        $this->addSql('DROP TABLE source_field_option');
        $this->addSql('DROP TABLE source_field_option_label');
        $this->addSql('DROP TABLE "user"');
    }
}
