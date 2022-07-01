<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220720133207 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE facet_configuration');
        $this->addSql('DROP TABLE category');
        $this->addSql('CREATE TABLE category (id INT NOT NULL, catalog_id INT NOT NULL, category_id VARCHAR(255) NOT NULL, parent_id VARCHAR(255) DEFAULT NULL, level INT NOT NULL, path VARCHAR(255) NOT NULL, name VARCHAR(255) NOT NULL, is_virtual BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_64C19C1CC3C66FC ON category (catalog_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_id_catalog ON category (category_id, catalog_id)');
        $this->addSql('CREATE TABLE facet_configuration (id VARCHAR(255) NOT NULL, source_field_id INT NOT NULL, category_id INT DEFAULT NULL, display_mode VARCHAR(255) DEFAULT NULL, coverage_rate INT DEFAULT NULL, max_size INT DEFAULT NULL, sort_order VARCHAR(255) DEFAULT NULL, is_recommendable BOOLEAN DEFAULT NULL, is_virtual BOOLEAN DEFAULT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_108F591B7173162 ON facet_configuration (source_field_id)');
        $this->addSql('CREATE INDEX IDX_108F591B12469DE2 ON facet_configuration (category_id)');
        $this->addSql('CREATE UNIQUE INDEX unique_source_field ON facet_configuration (source_field_id) WHERE (category_id IS NULL)');
        $this->addSql('CREATE UNIQUE INDEX unique_source_field_category ON facet_configuration (source_field_id, category_id) WHERE (category_id IS NOT NULL)');
        $this->addSql('ALTER TABLE category ADD CONSTRAINT FK_64C19C1CC3C66FC FOREIGN KEY (catalog_id) REFERENCES localized_catalog (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE facet_configuration ADD CONSTRAINT FK_108F591B7173162 FOREIGN KEY (source_field_id) REFERENCES source_field (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE facet_configuration ADD CONSTRAINT FK_108F591B12469DE2 FOREIGN KEY (category_id) REFERENCES category (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE facet_configuration DROP CONSTRAINT FK_108F591B12469DE2');
        $this->addSql('DROP TABLE category');
        $this->addSql('DROP TABLE facet_configuration');
    }
}
