<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20220530101752 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX unique_metadata_code');
        $this->addSql('ALTER TABLE source_field RENAME COLUMN name TO code');
        $this->addSql('CREATE UNIQUE INDEX unique_metadata_code ON source_field (code, metadata_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP INDEX unique_metadata_code');
        $this->addSql('ALTER TABLE source_field RENAME COLUMN code TO name');
        $this->addSql('CREATE UNIQUE INDEX unique_metadata_code ON source_field (name, metadata_id)');
    }
}
